#!/bin/bash
curl -X POST -H 'Content-Type: application/json' -d "{\"Repository\":\"event-ad-hswriting\",\"Tag\":\"${TRAVIS_TAG}\",\"Owner\":\"eHanlin\",\"Password\":\"${EHANLIN_PW}\",\"Name\":\"ad-hswriting\"}" 'http://test.ehanlin.com.tw/event/api/Deploy'

# case "${TRAVIS_TAG}" in
#   *SNAPSHOT* ) 
#     curl -X POST -H 'Content-Type: application/json' -d "{\"Repository\":\"event-ad-hswriting\",\"Tag\":\"${TRAVIS_TAG}\",\"Owner\":\"eHanlin\",\"Password\":\"${EHANLIN_PW}\",\"Name\":\"ad-hswriting\"}" 'http://test.ehanlin.com.tw/event/api/Deploy';;
#   *)
#   curl -X POST -H 'Content-Type: application/json' -d "{\"Repository\":\"event-ad-hswriting\",\"Tag\":\"${TRAVIS_TAG}\",\"Owner\":\"eHanlin\",\"Password\":\"${EHANLIN_PW}\",\"Name\":\"ad-hswriting\"}" 'http://www.ehanlin.com.tw/event/api/Deploy';;
# esac

