#!/usr/bin/env python3

import logging
import azure.functions as func
import json
import os
from lib.processing import process_request


VALID_TOKENS = [os.environ['TOKEN_PROD']]

def main(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:

    logging.info('Message received by Azure Functions')
    req_body_string = process_request(req, VALID_TOKENS)
    msg.set(req_body_string)
    logging.info('Message is submitted to eventHub')
    return func.HttpResponse(json.dumps({'text': 'Success', 'code': 0}), status_code=200)
