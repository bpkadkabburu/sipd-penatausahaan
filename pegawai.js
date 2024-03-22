const response = await fetch(`https://service.sipd.kemendagri.go.id/auth/strict/user-manager?page=2&limit=100000`, {
    headers: {
    'Authorization': `Bearer ${token}`
    }
});