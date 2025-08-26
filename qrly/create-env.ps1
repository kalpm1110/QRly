# PowerShell script to create .env.local file
# Run this script in your project directory

$envContent = @"
# Supabase Configuration
# Replace these placeholder values with your actual Supabase credentials

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Example format (replace with actual values):
# NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
"@

# Create the .env.local file
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Open .env.local in your code editor" -ForegroundColor White
Write-Host "2. Replace the placeholder values with your actual Supabase credentials" -ForegroundColor White
Write-Host "3. Restart your development server (npm run dev)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Get your credentials from: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api" -ForegroundColor Cyan
