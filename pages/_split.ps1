# Splits "KoMart Customer App.dc.html" into 21 standalone pages.
# Run from any location; uses absolute paths.

$ErrorActionPreference = 'Stop'
$srcPath = 'c:\Users\shokhrukh\Downloads\KoMart_Coding_Prompt_Pack\KoMart customer\KoMart Customer App.dc.html'
$outDir  = 'c:\Users\shokhrukh\Downloads\KoMart_Coding_Prompt_Pack\KoMart customer\pages'

# Page index -> output filename
$names = @{
    '01' = 'splash.html'
    '02' = 'langSelect.html'
    '03' = 'onboarding.html'
    '04' = 'phoneLogin.html'
    '05' = 'smsCode.html'
    '06' = 'createAccount.html'
    '07' = 'home.html'
    '08' = 'kBeauty.html'
    '09' = 'kStore.html'
    '10' = 'categories.html'
    '11' = 'ramenSubcategory.html'
    '12' = 'catalog.html'
    '13' = 'search.html'
    '14' = 'product.html'
    '15' = 'reviews.html'
    '16' = 'cart.html'
    '17' = 'checkoutBelowThreshold.html'
    '18' = 'checkoutFreeShipping.html'
    '19' = 'orderPlaced.html'
    '20' = 'favorites.html'
    '21' = 'profile.html'
}

# Petal seeds: [leftPct, widthPx, animDelaySec, animDurSec]
$seeds = @(
    @(8,14,0,9), @(22,10,2.5,11), @(38,16,1.2,8), @(55,9,3.8,12),
    @(70,13,0.6,10), @(84,11,2.1,9), @(15,8,4.5,13), @(92,15,1.8,11),
    @(47,12,5.2,10), @(63,8,3.1,12)
)
$blush       = @('#FADDE2','#F4C3CC','#F9E8E8')
$blushGreen  = @('#FADDE2','#F4C3CC','#D9EBC2')

function Build-Petals([int]$count, [string[]]$palette) {
    $inner = ''
    for ($i = 0; $i -lt $count; $i++) {
        $s = $seeds[$i]
        $color = $palette[$i % $palette.Length]
        $w = $s[1]; $h = [math]::Round($w * 0.85, 2)
        $inner += '<div style="position:absolute;top:-30px;left:' + $s[0] + '%;width:' + $w + 'px;height:' + $h + 'px;background:' + $color + ';border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal ' + $s[3] + 's linear ' + $s[2] + 's infinite"></div>'
    }
    return '<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;border-radius:34px">' + $inner + '</div>'
}

$splashPetals = Build-Petals 10 $blush
$onbPetals    = Build-Petals 7  $blush
$homePetals   = Build-Petals 5  $blushGreen

# Read source
$raw = [System.IO.File]::ReadAllText($srcPath)
$lines = $raw -split "`r?`n"

# Walk lines; a screen block starts at exactly 4 spaces + <div data-screen-label and ends at 4 spaces + </div>
$blocks = @()
$inBlock = $false
$current = $null
$labelNum = ''
$labelText = ''
$startRegex = '^    <div data-screen-label="(\d+) · (.+?)"'
$endRegex   = '^    </div>\s*$'

foreach ($line in $lines) {
    if (-not $inBlock) {
        if ($line -match $startRegex) {
            $inBlock  = $true
            $labelNum = $matches[1]
            $labelText = $matches[2]
            $current  = New-Object System.Collections.Generic.List[string]
            $current.Add($line)
        }
    } else {
        $current.Add($line)
        if ($line -match $endRegex) {
            $blocks += [pscustomobject]@{
                Num   = $labelNum
                Label = $labelText
                Body  = ($current -join "`n")
            }
            $inBlock = $false
            $current = $null
        }
    }
}

Write-Host "Found $($blocks.Count) screen blocks."

$headStyles = @'
html,body{margin:0;padding:0;background:#EDEAE3;color:#2B2723;font-family:'Manrope',Inter,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
a{color:inherit}
@keyframes komartPetal{0%{transform:translate3d(0,-40px,0) rotate(0deg);opacity:0}10%{opacity:.85}80%{opacity:.75}100%{transform:translate3d(48px,880px,0) rotate(230deg);opacity:0}}
body{display:flex;justify-content:center;padding:40px 20px}
.kom-page{display:flex;flex-direction:column;gap:12px}
'@

foreach ($b in $blocks) {
    $fname = $names[$b.Num]
    if (-not $fname) { Write-Warning "No filename mapping for $($b.Num)"; continue }

    $body = $b.Body
    $body = $body -replace '\{\{\s*splashPetals\s*\}\}', [regex]::Escape($splashPetals).Replace('\','\\')
    # The above escape trick is wrong for -replace replacement strings; do it manually:
    $body = $b.Body
    $body = $body.Replace('{{ splashPetals }}', $splashPetals)
    $body = $body.Replace('{{ onbPetals }}',    $onbPetals)
    $body = $body.Replace('{{ homePetals }}',   $homePetals)

    $title = "KoMart Customer · $($b.Num) · $($b.Label)"

    $html = @"
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$title</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<style>
$headStyles
</style>
</head>
<body>
<div class="kom-page">
$body
</div>
</body>
</html>
"@

    $outPath = Join-Path $outDir $fname
    [System.IO.File]::WriteAllText($outPath, $html, [System.Text.UTF8Encoding]::new($false))
    Write-Host ("  wrote {0,-32}  ({1} · {2})" -f $fname, $b.Num, $b.Label)
}
