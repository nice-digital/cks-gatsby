#cd ../../fake-api/data/topics
#filenames = (IFS=' ' read -r -a array <<< $(ls ../../fake-api/data/topics))
#echo($filenames)

arr=(../../fake-api/data/topics/*)

# iterate through array using a counter
for ((i=0; i<${#arr[@]}; i++)); do
	#Get topicname prop from json in the current file
	topicName=`grep -i 'topicName' ${arr[$i]}`
	#Change topicname to title. This is specified in the elasticsearch document definition
	topicName="${topicName/"topicName"/"title"}"
	
	topicSummary=`grep -i -m1 'topicSummary' ${arr[$i]}`
	topicSummary="${topicSummary/"topicSummary"/"content"}"
	#remove trailing comma
	topicSummary=${topicSummary::-1}
	
	json="{$topicName$topicSummary}"
	url="http://localhost:9200/ckstest1/document/$i"
	
	curl -X PUT $url -H 'Content-Type: application/json' -d "$json"
	echo $url
	echo $json
done