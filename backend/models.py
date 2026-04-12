import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)


class Workspaces(Base):
    __tablename__ = "workspaces"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    credits_remaining = Column(Integer, default=0)   
    stripe_customer_id = Column(String(255), unique=True, nullable=True)
    stripe_subscription_id = Column(String(255), unique=False, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)   


class Agents(Base):
    __tablename__ = "agents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"))
    name = Column(String(255), nullable=False)
    system_prompt = Column(Text, nullable=False)
    tone = Column(String(255), nullable=False)
    is_deleted = Column(Boolean, default=False)


class Campaigns(Base):
    __tablename__ = "campaigns"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id"))  
    title = Column(String(255), nullable=False)
    status = Column(Enum("draft", "running", "paused", "completed", name="campaign_status_enum"), default="draft")
    is_deleted = Column(Boolean, default=False)


class Leads(Base):
    __tablename__ = "leads"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"))  
    company_name = Column(String(255), nullable=False)
    company_url = Column(String(255), nullable=False)
    ai_research_summary = Column(Text, nullable=False)
    drafted_email = Column(Text, nullable=True)
    status = Column(Enum("pending", "researching", "drafted", "approved", "rejected", name="lead_status_enum"), default="pending")
    is_deleted = Column(Boolean, default=False)


class AgentActivityLogs(Base):
    __tablename__ = "agent_activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"))
    action_type = Column(String(255), nullable=False)
    log_output = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_deleted = Column(Boolean, default=False)

    
