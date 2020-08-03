#!/bin/bash

#populate indexes
arr=(../../fake-api/data/topics/*)

# iterate through array using a counter
for ((i=0; i<${#arr[@]}; i++));
do
	id="\"_id\": \"$((i+1))\""
	
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
	
	echo "{ \"index\": {$id} }" >> esIndexData.json
	echo "{$topicName $topicSummary $boostValue}" >> esIndexData.json
	
done
