#!/bin/bash
#Wait until the elastic search container is ready
while [ "$(curl -X GET -s -w '%{http_code}' http://elasticsearch:9200/_cat/indices)" -ne 200 ]
do
   sleep 5s
done

#create index
curl -X PUT http://elasticsearch:9200/cks -H 'Content-Type: application/json' --data-binary "@./elasticSetup/CKSIndexSettings.json"

#Put data into the index
curl -X PUT http://elasticsearch:9200/cks/document/_bulk -H 'Content-Type: application/json' --data-binary "@./elasticSetup/esIndexData.json"

