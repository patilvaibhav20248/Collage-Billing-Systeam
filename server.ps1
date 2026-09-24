$port = 8000
$basePath = "d:\project"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webp" = "image/webp"
    ".pdf"  = "application/pdf"
}

try {
    $listener.Start()
    Write-Output "Server running at http://localhost:$port/"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
            $response.AddHeader("Pragma", "no-cache")
            $response.AddHeader("Expires", "0")

            $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
            if ($urlPath -eq "/" -or [string]::IsNullOrWhiteSpace($urlPath)) {
                $urlPath = "/index.html"
            }

            $localPath = [System.IO.Path]::Combine($basePath, $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar))

            if ([System.IO.File]::Exists($localPath)) {
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $response.ContentLength64 = $bytes.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        } catch {
            Write-Warning "Request error: $_"
        } finally {
            try { $response.OutputStream.Close() } catch {}
            try { $response.Close() } catch {}
        }
    }
} finally {
    try { $listener.Stop() } catch {}
    try { $listener.Close() } catch {}
}
