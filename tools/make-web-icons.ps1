# Vẽ biểu tượng cho bản web (iPhone/iPad, Android trình duyệt): ngôi sao cười trên nền cam, hình vuông kín.
param([string]$OutDir = "public/icons")
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $OutDir | Out-Null
function Draw-Icon([int]$S) {
  $bmp = New-Object System.Drawing.Bitmap $S, $S
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::Transparent)
  $k = $S / 256.0

  # Nền cam phủ kín (iOS tự bo góc)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddRectangle((New-Object System.Drawing.RectangleF 0, 0, $S, $S))
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.PointF 0, 0), (New-Object System.Drawing.PointF 0, $S), ([System.Drawing.Color]::FromArgb(255, 255, 160, 90)), ([System.Drawing.Color]::FromArgb(255, 255, 106, 80))
  $g.FillPath($bg, $path)

  # Ngôi sao
  $cx = 128 * $k; $cy = 134 * $k; $R = 98 * $k; $ri = 46 * $k
  $pts = New-Object 'System.Drawing.PointF[]' 10
  for ($i = 0; $i -lt 10; $i++) {
    $rad = if ($i % 2 -eq 0) { $R } else { $ri }
    $a = [Math]::PI / 5 * $i - [Math]::PI / 2
    $pts[$i] = New-Object System.Drawing.PointF ([float]($cx + $rad * [Math]::Cos($a))), ([float]($cy + $rad * [Math]::Sin($a)))
  }
  $ol = [System.Drawing.Color]::FromArgb(255, 61, 44, 44)
  $pen = New-Object System.Drawing.Pen $ol, ([float](9 * $k))
  $pen.LineJoin = 'Round'
  $g.FillPolygon((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 210, 63))), $pts)
  $g.DrawPolygon($pen, $pts)

  # Mặt cười
  $ink = New-Object System.Drawing.SolidBrush $ol
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  foreach ($ex in @(106, 150)) {
    $g.FillEllipse($ink, [float](($ex - 11) * $k), [float](118 * $k), [float](22 * $k), [float](26 * $k))
    $g.FillEllipse($white, [float](($ex - 2) * $k), [float](122 * $k), [float](8 * $k), [float](8 * $k))
  }
  $blush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(150, 255, 120, 140))
  $g.FillEllipse($blush, [float](80 * $k), [float](146 * $k), [float](20 * $k), [float](12 * $k))
  $g.FillEllipse($blush, [float](156 * $k), [float](146 * $k), [float](20 * $k), [float](12 * $k))
  $mouth = New-Object System.Drawing.Pen $ol, ([float](7 * $k))
  $mouth.StartCap = 'Round'; $mouth.EndCap = 'Round'
  $g.DrawArc($mouth, [float](112 * $k), [float](140 * $k), [float](32 * $k), [float](24 * $k), 20, 140)

  $g.Dispose()
  return $bmp
}

foreach ($s in @(180, 192, 512)) {
  $bmp = Draw-Icon $s
  $bmp.Save((Join-Path $OutDir "icon-$s.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}
"OK"
