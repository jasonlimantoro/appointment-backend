#!/bin/bash

apig-test \
  --username='dummy-staff' \
  --password='dummy&Staff' \
  --user-pool-id='us-east-1_Pv8Y1sOqQ' \
  --app-client-id='3lb5e2q7uoap9shdc3skta638n' \
  --cognito-region='us-east-1' \
  --identity-pool-id='us-east-1:73f85fc4-cf76-49c1-87e2-6fbcc8354dbb' \
  --invoke-url='https://6q3xef9qj7.execute-api.us-east-1.amazonaws.com/dev' \
  --api-gateway-region='us-east-1' \
  --path-template='/graphql' \
  --method='GET' \
  --additional-params='{"queryParams": {"query": "{listGuest{id firstName lastName email}}"}}'