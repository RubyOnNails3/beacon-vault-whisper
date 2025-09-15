# Vercel Deployment Guide for Beacon Vault Whisper

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare the required configuration

## Step-by-Step Deployment

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Access Vercel Dashboard
1. Go to [https://vercel.com/](https://vercel.com/)
2. Sign in with your GitHub account
3. Click "New Project"

#### Step 2: Import Repository
1. Select "Import Git Repository"
2. Find and select `RubyOnNails3/beacon-vault-whisper`
3. Click "Import"

#### Step 3: Configure Project Settings
- **Project Name**: `beacon-vault-whisper`
- **Framework Preset**: `Vite` (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Step 4: Set Environment Variables
In the "Environment Variables" section, add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_WALLET_CONNECT_PROJECT_ID` | `2ec9743d0d0cd7fb94dee1a7e6d33475` | Production, Preview, Development |
| `VITE_CHAIN_ID` | `11155111` | Production, Preview, Development |
| `VITE_RPC_URL` | `https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990` | Production, Preview, Development |
| `VITE_CONTRACT_ADDRESS` | `0x0000000000000000000000000000000000000000` | Production, Preview, Development |
| `NEXT_PUBLIC_CHAIN_ID` | `11155111` | Production, Preview, Development |
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990` | Production, Preview, Development |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | `2ec9743d0d0cd7fb94dee1a7e6d33475` | Production, Preview, Development |
| `NEXT_PUBLIC_INFURA_API_KEY` | `b18fb7e6ca7045ac83c41157ab93f990` | Production, Preview, Development |

#### Step 5: Deploy
1. Click "Deploy" button
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at the provided URL

### Method 2: Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Navigate to Project Directory
```bash
cd /path/to/beacon-vault-whisper
```

#### Step 4: Deploy
```bash
vercel
```

#### Step 5: Set Environment Variables
```bash
vercel env add VITE_WALLET_CONNECT_PROJECT_ID
# Enter: 2ec9743d0d0cd7fb94dee1a7e6d33475

vercel env add VITE_CHAIN_ID
# Enter: 11155111

vercel env add VITE_RPC_URL
# Enter: https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

vercel env add VITE_CONTRACT_ADDRESS
# Enter: 0x0000000000000000000000000000000000000000

vercel env add NEXT_PUBLIC_CHAIN_ID
# Enter: 11155111

vercel env add NEXT_PUBLIC_RPC_URL
# Enter: https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

vercel env add NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
# Enter: 2ec9743d0d0cd7fb94dee1a7e6d33475

vercel env add NEXT_PUBLIC_INFURA_API_KEY
# Enter: b18fb7e6ca7045ac83c41157ab93f990
```

#### Step 6: Deploy to Production
```bash
vercel --prod
```

## Post-Deployment Configuration

### 1. Custom Domain (Optional)
1. Go to your project dashboard in Vercel
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

### 2. Environment Variables Management
- **Production**: Use for live deployment
- **Preview**: Use for pull request previews
- **Development**: Use for local development

### 3. Build Settings
- **Node.js Version**: 18.x (recommended)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Node.js version compatibility
- Ensure all dependencies are properly installed
- Verify environment variables are set correctly

#### 2. Environment Variables Not Loading
- Ensure variables are prefixed with `VITE_` for client-side access
- Check that variables are set for the correct environment
- Redeploy after adding new environment variables

#### 3. Wallet Connection Issues
- Verify WalletConnect Project ID is correct
- Check RPC URL is accessible
- Ensure contract address is valid

#### 4. Contract Interaction Issues
- Verify contract is deployed on Sepolia testnet
- Check contract address in environment variables
- Ensure user has testnet ETH for transactions

### Build Logs
Access build logs in Vercel dashboard:
1. Go to your project
2. Click on the deployment
3. View "Build Logs" tab

### Function Logs
For serverless functions (if any):
1. Go to your project
2. Click on the deployment
3. View "Function Logs" tab

## Performance Optimization

### 1. Build Optimization
- Enable Vercel's automatic optimizations
- Use Vite's build optimizations
- Minimize bundle size

### 2. Caching
- Configure appropriate cache headers
- Use Vercel's Edge Network
- Implement proper CDN caching

### 3. Monitoring
- Set up Vercel Analytics
- Monitor Core Web Vitals
- Track performance metrics

## Security Considerations

### 1. Environment Variables
- Never commit sensitive data to repository
- Use Vercel's environment variable encryption
- Rotate API keys regularly

### 2. HTTPS
- Vercel automatically provides HTTPS
- Configure proper security headers
- Use secure cookies if applicable

### 3. Access Control
- Implement proper authentication
- Use secure wallet connections
- Validate all user inputs

## Maintenance

### 1. Updates
- Regularly update dependencies
- Monitor for security vulnerabilities
- Test updates in preview environment first

### 2. Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track user analytics

### 3. Backups
- Regular database backups (if applicable)
- Version control for all code changes
- Document configuration changes

## Support

For additional help:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)

## Deployment Checklist

- [ ] Repository is pushed to GitHub
- [ ] Environment variables are configured
- [ ] Build command is correct
- [ ] Output directory is set to `dist`
- [ ] Custom domain is configured (if needed)
- [ ] SSL certificate is active
- [ ] Analytics are set up
- [ ] Error monitoring is configured
- [ ] Performance monitoring is active
- [ ] Security headers are configured
