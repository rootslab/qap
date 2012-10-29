fails=0
for t in test/*-test.js; do
  echo -e "\n[" $t "]"
  node $t || let fails++
done
exit $fails
