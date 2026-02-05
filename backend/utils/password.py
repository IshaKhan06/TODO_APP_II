from passlib.context import CryptContext

# Create password context using argon2 which is more compatible
# Argon2 is the winner of the Password Hashing Competition
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__rounds=4,
    argon2__memory_cost=512,
    argon2__parallelism=2
)

def hash_password(password: str) -> str:
    """Hash a plain text password using argon2."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)