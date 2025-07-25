#!/usr/bin/env node

/**
 * Deployment script for Form Builder application
 * This script handles the complete deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DeploymentManager {
  constructor() {
    this.logFile = path.join(__dirname, 'deployment.log');
    this.startTime = Date.now();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Write to log file
    fs.appendFileSync(this.logFile, logMessage + '\n');
  }

  async runCommand(command, description) {
    this.log(`Starting: ${description}`);
    
    try {
      const result = execSync(command, { 
        stdio: 'inherit',
        encoding: 'utf8'
      });
      
      this.log(`Completed: ${description}`);
      return result;
    } catch (error) {
      this.log(`Failed: ${description} - ${error.message}`);
      throw error;
    }
  }

  checkEnvironment() {
    this.log('Checking environment...');
    
    // Check if .env file exists
    if (!fs.existsSync('.env') && !fs.existsSync('.env.local')) {
      this.log('WARNING: No .env file found. Using default configuration.');
    }
    
    // Check Node.js version
    const nodeVersion = process.version;
    this.log(`Node.js version: ${nodeVersion}`);
    
    if (parseInt(nodeVersion.slice(1)) < 18) {
      throw new Error('Node.js version 18 or higher is required');
    }
    
    // Check if dependencies are installed
    if (!fs.existsSync('node_modules')) {
      this.log('Installing dependencies...');
      this.runCommand('npm install', 'Installing dependencies');
    }
    
    this.log('Environment check passed');
  }

  async runTests() {
    this.log('Running tests...');
    
    try {
      // Run type checking
      await this.runCommand('npm run type-check', 'TypeScript type checking');
      
      // Run linting
      await this.runCommand('npm run lint', 'ESLint checks');
      
      // Run workflow tests
      await this.runCommand('npm run test-workflow', 'Workflow tests');
      
      this.log('All tests passed');
    } catch (error) {
      this.log('Tests failed. Deployment aborted.');
      throw error;
    }
  }

  async buildApplication() {
    this.log('Building application...');
    
    try {
      await this.runCommand('npm run build', 'Building Next.js application');
      this.log('Build completed successfully');
    } catch (error) {
      this.log('Build failed. Deployment aborted.');
      throw error;
    }
  }

  async runDatabaseMigrations() {
    this.log('Running database migrations...');
    
    if (process.env.DATABASE_URL) {
      try {
        await this.runCommand('npm run db:migrate', 'Database migrations');
        this.log('Database migrations completed');
      } catch (error) {
        this.log('Database migrations failed. Continuing with deployment...');
        this.log(`Migration error: ${error.message}`);
      }
    } else {
      this.log('No DATABASE_URL found. Skipping database migrations.');
    }
  }

  generateDeploymentReport() {
    const endTime = Date.now();
    const duration = (endTime - this.startTime) / 1000;
    
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      status: 'success',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      nextVersion: this.getPackageVersion('next'),
      deployment: {
        build: true,
        tests: true,
        migrations: !!process.env.DATABASE_URL
      }
    };
    
    const reportPath = path.join(__dirname, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Deployment report saved to: ${reportPath}`);
    this.log(`Total deployment time: ${duration}s`);
    
    return report;
  }

  getPackageVersion(packageName) {
    try {
      const packageJson = require(path.join(__dirname, 'package.json'));
      return packageJson.dependencies[packageName] || packageJson.devDependencies[packageName];
    } catch {
      return 'unknown';
    }
  }

  async deploy() {
    this.log('🚀 Starting deployment process...');
    
    try {
      // Pre-deployment checks
      this.checkEnvironment();
      
      // Run tests
      await this.runTests();
      
      // Build application
      await this.buildApplication();
      
      // Run database migrations
      await this.runDatabaseMigrations();
      
      // Generate deployment report
      const report = this.generateDeploymentReport();
      
      this.log('✅ Deployment completed successfully!');
      this.log(`📊 Deployment Report: ${JSON.stringify(report, null, 2)}`);
      
      return report;
      
    } catch (error) {
      this.log(`❌ Deployment failed: ${error.message}`);
      
      const failureReport = {
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: error.message,
        duration: `${(Date.now() - this.startTime) / 1000}s`
      };
      
      fs.writeFileSync(
        path.join(__dirname, 'deployment-failure.json'),
        JSON.stringify(failureReport, null, 2)
      );
      
      process.exit(1);
    }
  }
}

// Run deployment if script is executed directly
if (require.main === module) {
  const deployment = new DeploymentManager();
  deployment.deploy();
}

module.exports = DeploymentManager;
