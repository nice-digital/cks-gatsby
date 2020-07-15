#!/bin/bash
#Wait 30 seconds to ensure elastic search container is ready
echo "sleep"
sleep 90s
echo "awake"

#create indexes
#Naming the index cks means we done need to create an alias
curl -X PUT http://elasticsearch:9200/cks -H 'Content-Type: application/json' --data-binary "@./elasticSetup/CKSIndexSettings.json"

#populate indexes
arr=(./elasticSetup/topics/*)

# iterate through array using a counter
for ((i=0; i<${#arr[@]}; i++)); do
	#Get topicname prop from json in the current file
	topicName=`grep -i 'topicName' ${arr[$i]}`
	#Change topicname to title. This is specified in the elasticsearch document definition
	topicName="${topicName/"topicName"/"title"}"
	
	#Get topicSummary prop from json in the current file
	topicSummary=`grep -i -m1 'topicSummary' ${arr[$i]}`
	#For testing we use the topicSummary as the content.
	topicSummary="${topicSummary/"topicSummary"/"content"}"
	
	#remove trailing comma
	#topicSummary=${topicSummary::-1}
	
	#Boostvalue field is required as specified in the elasticsearch document definition
	#Omission will cause any searches to fail
	boostValue='"boostvalue": 100'
	
	json="{$topicName $topicSummary $boostValue}"
	url="http://elasticsearch:9200/cks/document/$i"
	
	curl -X PUT $url -H 'Content-Type: application/json' -d "$json"
	echo $url
	echo $json
done

exit 0
