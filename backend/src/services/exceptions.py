class ServiceValidationError(ValueError):
    """Raised when a service receives an invalid value after schema validation."""


class RelatedResourceNotFoundError(ServiceValidationError):
    """Raised when an event references a database object that does not exist."""
