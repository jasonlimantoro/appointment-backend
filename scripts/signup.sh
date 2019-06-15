#!/bin/bash

aws cognito-idp sign-up \
  --region us-east-1 \
  --client-id 3lb5e2q7uoap9shdc3skta638n \
  --username "dummy-staff" \
  --password "dummy&Staff"
