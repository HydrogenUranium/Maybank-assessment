#!/usr/bin/env python3

import logging
import json
import azure.functions as func


def process_request(req: func.HttpRequest, valid_tokens: list[str]) -> func.HttpResponse:

    req_body_bytes: bytes = None
    try:
        req_body_bytes = req.get_body()
    except ValueError:
        logging.error('Request body could not be read')
        return func.HttpResponse(
            json.dumps({'text': 'Internal server error', 'code': 8}),
            status_code=500, mimetype="application/json")

    if req_body_bytes is None or len(req_body_bytes) == 0:
        logging.warn('No data in the payload to process')
        return func.HttpResponse(json.dumps({'text': 'No data', 'code': 5}),
                                 status_code=400, mimetype="application/json")

    req_auth_value = req.headers.get('Authorization')
    if req_auth_value is None or len(req_auth_value) == 0:
        logging.warn('Authorization header is missing')
        return func.HttpResponse(
            json.dumps({'text': 'Authorization is required', 'code': 2}),
            status_code=401, mimetype="application/json")

    try:
        (auth_type, auth_token) = req_auth_value.split(" ")
        if auth_type is None or auth_type != 'Splunk':
            logging.warn('Invalid authorization header')
            raise ValueError
    except ValueError:
        return func.HttpResponse(
            json.dumps({'text': 'Invalid authorization', 'code': 3}),
            status_code=401, mimetype="application/json")

    if auth_token is None or auth_token not in valid_tokens:
        logging.warn('Invalid token')
        return func.HttpResponse(json.dumps({'text': 'Invalid token', 'code': 4}),
                                 status_code=403, mimetype="application/json")

    message_len: int = len(req_body_bytes)
    logging.info('Message payload size: %d', message_len)
    if message_len > 262144:
        logging.warn('Payload is too large: %d > 262144', message_len)
        return func.HttpResponse(
            json.dumps({'text': 'Payload is too large', 'code': 99}),
            status_code=400, mimetype="application/json")

    return func.HttpResponse(json.dumps({'text': 'Success', 'code': 0}), status_code=200, mimetype="application/json")
