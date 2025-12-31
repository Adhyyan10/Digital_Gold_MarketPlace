# PowerShell script to properly remove dark: classes from JSX files

$files = @(
    "src\components\Header.jsx",
    "src\components\AIRecommendations.jsx",
    "src\components\CheckoutForm.jsx",
    "src\components\ErrorBoundary.jsx",
    "src\components\Notifications.jsx",
    "src\components\OrderHistory.jsx",
    "src\components\PriceChart.jsx",
    "src\components\Profile.jsx",
    "src\components\Settings.jsx",
    "src\components\TradePanel.jsx",
    "src\components\Wallet.jsx",
    "src\pages\Dashboard.jsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    # Remove dark: classes but keep the space after them
    $content = $content -replace 'dark:[a-zA-Z0-9\-\/\[\]]+\s+', ''
    # Remove dark: classes at end of className (before closing quote)
    $content = $content -replace '\s+dark:[a-zA-Z0-9\-\/\[\]]+(?=")', ''
    Set-Content $file $content -NoNewline
    Write-Host "Fixed: $file"
}

Write-Host "All files fixed!"
