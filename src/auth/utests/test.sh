curl -X PUT -H "Content-Type: application/json" -d "@lesson-settime.req" http://localhost:3888/api/lesson/ls-1035796777-1460857443-1468566837-1468576800/set-time | jq
curl -X PUT -H "Content-Type: application/json" -d "@lessons-settime.req" http://localhost:3888/api/lessons/set-time | jq
