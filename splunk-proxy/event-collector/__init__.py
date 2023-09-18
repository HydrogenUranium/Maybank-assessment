#!/usr/bin/env python3

import logging
import azure.functions as func
import json
import os
import typing

TOKEN_NAME_PROD = "TOKEN_PROD"
TOKEN_NAME_STAGE = "TOKEN_STAGE"
MIMETYPE_JSON: str = "application/json"
MESSAGE_SIZE_LIMIT = 256 * 1024


def store_to_eventhub(msgprod: func.Out[typing.List[str]], msgstage: func.Out[typing.List[str]], body: str):
    output_prod = []
    output_stage = []
    req_body_list = body.replace('}{', '}|||{').split('|||')
    for event in req_body_list:
        message_len: int = len(event)
        logging.info(f'Message: {event}')
        logging.info('Message payload size: %d', message_len)
        if message_len > MESSAGE_SIZE_LIMIT:
            logging.error(
                f'Payload is too large: {message_len} > {MESSAGE_SIZE_LIMIT}')
            continue
        try:
            data_dict = json.loads(event)
        except ValueError as e:
            logging.error(f"Message '{event}' can't be parsed as JSON: {e}")
            continue
        if data_dict['index'] == "discover_prod":
            output_prod.append(event)
        if data_dict['index'] == "discover_staging":
            output_stage.append(event)
    if len(output_prod) > 0:
        msgprod.set(output_prod)
    if len(output_stage) > 0:
        msgstage.set(output_stage)


def main(req: func.HttpRequest, msgprod: func.Out[typing.List[str]], msgstage: func.Out[typing.List[str]]) -> func.HttpResponse:

    try:
        VALID_TOKENS = [os.environ[TOKEN_NAME_PROD],
                        os.environ[TOKEN_NAME_STAGE]]
    except KeyError as e:
        return func.HttpResponse(f"Environment variable is not set ${e}", status_code=500)

    logging.info('Message received by Azure Functions')

    req_body_bytes: bytes
    try:
        req_body_bytes = req.get_body()
    except ValueError:
        logging.error('Request body could not be read')
        return func.HttpResponse(
            json.dumps({'text': 'Internal server error', 'code': 8}),
            status_code=500, mimetype=MIMETYPE_JSON)

    if req_body_bytes is None or len(req_body_bytes) == 0:
        logging.warn('No data in the payload to process')
        return func.HttpResponse(json.dumps({'text': 'No data', 'code': 5}), status_code=400, mimetype=MIMETYPE_JSON)

    req_auth_value = req.headers.get('Authorization')
    if req_auth_value is None or len(req_auth_value) == 0:
        logging.warn('Authorization header is missing')
        return func.HttpResponse(
            json.dumps({'text': 'Authorization is required', 'code': 2}),
            status_code=401, mimetype=MIMETYPE_JSON)

    try:
        (auth_type, auth_token) = req_auth_value.split(" ")
        if auth_type is None or auth_type != 'Splunk':
            logging.warn('Invalid authorization header')
            raise ValueError
    except ValueError:
        return func.HttpResponse(
            json.dumps({'text': 'Invalid authorization', 'code': 3}),
            status_code=401, mimetype=MIMETYPE_JSON)

    if auth_token is None or auth_token not in VALID_TOKENS:
        logging.warn('Invalid token')
        return func.HttpResponse(
            json.dumps({'text': 'Invalid token', 'code': 4}),
            status_code=403, mimetype=MIMETYPE_JSON)

    req_body_string = req.get_body().decode("utf-8")
    # logging.info(f"Message: {req_body_string}")
    store_to_eventhub(msgprod, msgstage, req_body_string)

    logging.info('Message is submitted to eventHub')
    return func.HttpResponse(json.dumps({'text': 'Success', 'code': 0}), status_code=200, mimetype=MIMETYPE_JSON)
