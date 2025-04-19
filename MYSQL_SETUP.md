# MySQL Setup Guide for UrbanPulse

This guide will help you set up MySQL for the UrbanPulse application.

## Prerequisites

- MySQL 8.0 or higher
- Command-line access or MySQL Workbench

## Installation

### Windows

1. Download the MySQL Installer from the [official MySQL website](https://dev.mysql.com/downloads/installer/).
2. Run the installer and follow the installation wizard.
3. Select "Developer Default" or "Server only" installation type.
4. Complete the installation process, setting a root password when prompted.
5. Make sure the MySQL service is running.

### macOS

Using Homebrew:

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation
```

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Install MySQL
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Enable MySQL to start on boot
sudo systemctl enable mysql

# Secure MySQL installation
sudo mysql_secure_installation
```

## Database Setup

1. Log in to MySQL:

```bash
mysql -u root -p
```

2. Create a database for UrbanPulse:

```sql
CREATE DATABASE urbanpulse;
```

3. Create a user and grant privileges:

```sql
CREATE USER 'urbanpulse_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON urbanpulse.* TO 'urbanpulse_user'@'localhost';
FLUSH PRIVILEGES;
```

4. Exit MySQL:

```sql
EXIT;
```

## Configure UrbanPulse to Use Your Database

1. Update the `.env` file in your UrbanPulse project:

```
DATABASE_URL="mysql://urbanpulse_user:your_strong_password@localhost:3306/urbanpulse"
```

2. Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev
```

## Verify Connection

To verify that UrbanPulse can connect to your MySQL database:

```bash
npx prisma db pull
```

If successful, this command will reflect your database schema in your Prisma schema.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify MySQL is running:
   ```bash
   # Windows
   sc query mysql

   # macOS
   brew services list

   # Linux
   sudo systemctl status mysql
   ```

2. Check your credentials and connection string.

3. Ensure the MySQL port (default: 3306) is not blocked by a firewall.

### Permission Issues

If you encounter permission issues:

```sql
GRANT ALL PRIVILEGES ON *.* TO 'urbanpulse_user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

## Using MySQL Workbench (Optional)

MySQL Workbench provides a graphical interface for managing your MySQL database:

1. Download and install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/).
2. Connect to your MySQL server.
3. You can view and manage the UrbanPulse database through this interface.

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma with MySQL](https://www.prisma.io/docs/concepts/database-connectors/mysql)
