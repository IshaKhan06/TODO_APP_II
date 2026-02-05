from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.user import User
from utils.password import hash_password, verify_password
from typing import Optional


class UserService:
    @staticmethod
    def create_user(db: Session, email: str, password: str, name: Optional[str] = None) -> Optional[User]:
        """
        Create a new user with hashed password
        """
        try:
            # Hash the password
            hashed_pwd = hash_password(password)

            # Generate user ID based on email (similar to the current approach)
            user_id = f"user_{email.split('@')[0]}"

            # Create new user instance
            db_user = User(
                id=user_id,
                email=email,
                hashed_password=hashed_pwd,  # Add the hashed password
                name=name
            )

            # Add to database
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

            return db_user
        except IntegrityError:
            # Email already exists
            db.rollback()
            return None
        except Exception as e:
            db.rollback()
            raise e

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Retrieve user by email
        """
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate user by email and password
        """
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user