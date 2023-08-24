#!/usr/bin/env python3

import logging
import azure.functions as func
import os
from lib.processing import process_request


VALID_TOKENS = [os.environ['TOKEN_PROD']]

def main(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:

    logging.info('Message received by Azure Functions')
    http_response = process_request(req, VALID_TOKENS)
    if http_response.status_code == 200:
        req_body_string = req.get_body().decode("utf-8")
        msg.set(req_body_string)
        logging.info('Message is submitted to eventHub')
    return http_response
