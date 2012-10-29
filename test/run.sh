fails=0
for t in test/*-test.js; do
  echo "[" $t "]"
  node $t || let fails++
done
exit $fails
