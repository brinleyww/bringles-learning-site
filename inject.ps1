$root = "c:\Users\boran\Downloads\bringles-learning-site\Silly things"
Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $content = Get-Content -Raw -Encoding UTF8 $_.FullName
    if ($content -notmatch "bosskey\.js") {
        # Calculate relative path
        $path = $_.FullName
        $sub = $path.Substring($root.Length)
        $sub = $sub.TrimStart('\').TrimStart('/')
        
        $parts = $sub.Split("\/")
        $depth = 0
        foreach ($p in $parts) {
            if ($p.Length -gt 0) {
                $depth++
            }
        }
        
        $relPath = ""
        for($i=0; $i -lt $depth; $i++) {
            $relPath += "../"
        }
        $relPath += "bosskey.js"
        
        $scriptTag = "<script src=`"$relPath`"></script>"
        
        # Insert before </body> if present, else append
        if ($content -match "(?i)</body>") {
            $content = $content -replace "(?i)</body>", "$scriptTag`n</body>"
        } else {
            $content = $content + "`n" + $scriptTag
        }
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8
        Write-Host "Injected into $($_.Name) ($relPath)"
    }
}
