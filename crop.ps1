Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\adith\Downloads\CODE (29) (1)\cg-junni\assets\blue-boy-leo-shimeji-sprite-preview-removebg-preview.png"
$outputDir = "c:\Users\adith\Downloads\CODE (29) (1)\cg-junni\assets\sprites"

if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
} else {
    # Clean up the output dir first so we don't mix old files with the new ones
    Remove-Item -Path "$outputDir\*" -Force
}

$img = [System.Drawing.Bitmap]::FromFile($inputPath)
$width = $img.Width
$height = $img.Height

$cols = 6
$rows = 6

$count = 0
for ($r = 0; $r -lt $rows; $r++) {
    for ($c = 0; $c -lt $cols; $c++) {
        $x = [math]::Floor($c * ($width / $cols))
        $y = [math]::Floor($r * ($height / $rows))
        
        $w = [math]::Floor(($c + 1) * ($width / $cols)) - $x
        $h = [math]::Floor(($r + 1) * ($height / $rows)) - $y
        
        $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
        $cropped = $img.Clone($rect, $img.PixelFormat)
        
        $numStr = $count.ToString("D2")
        $outFile = Join-Path $outputDir "sprite_$numStr.png"
        $cropped.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
        $cropped.Dispose()
        
        Write-Host "Saved $outFile"
        $count++
    }
}

$img.Dispose()
Write-Host "Total extracted sprites: $count"
