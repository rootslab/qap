fails=0
n=0
for t in test/*-test.js; do
  echo -e "\n[" $t "]"
  node $t || let fails++
  let n++
done
echo $n "test files executed"
exit $fails
