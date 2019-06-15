#!/bin/bash

aws cognito-idp admin-confirm-sign-up \
  --region us-east-1 \
  --user-pool-id us-east-1_Pv8Y1sOqQ \
  --username "dummy-staff"