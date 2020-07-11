#Naming the index cks means we done need to create an alias
curl -X PUT http://localhost:9200/cks -H 'Content-Type: application/json' --data-binary "@./CKSIndexSettings.json"