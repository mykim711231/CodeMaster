$line = '| 1 | Java Core | Java Language Basics (outside Spring Boot scope) | https://docs.oracle.com/javase/tutorial/ | [x] |'
$cols = $line -split '\|'
Write-Host "Count=$($cols.Count)"
for($i=0;$i -lt $cols.Count;$i++){
    Write-Host "c[$i]='${cols[$i]}'"
}
