import pytest

from app.config import Settings, settings
from app.messaging.mongo_broker import MongoBroker
from app.messaging.nats_broker import NatsBroker
from app.services.presentation.consumer import make_broker


@pytest.mark.parametrize("provider,cls", [("mongo", MongoBroker), ("nats", NatsBroker)])
def test_make_broker_follows_queue_provider(monkeypatch, provider, cls):
    monkeypatch.setattr(settings, "queue_provider", provider)
    broker = make_broker()
    assert isinstance(broker, cls)
    assert (broker.ack_wait, broker.max_deliver) == (settings.pres_ack_wait_seconds, settings.pres_max_deliver)
    if provider == "nats":
        assert broker.url == settings.nats_url


def test_make_broker_builds_azure_storage_queue(monkeypatch):
    pytest.importorskip("azure.storage.queue")
    from app.messaging.azure_storage_queue_broker import AzureStorageQueueBroker

    monkeypatch.setattr(settings, "queue_provider", "azure_storage_queue")
    monkeypatch.setattr(settings, "azure_storage_queue_connection_string", "UseDevelopmentStorage=true")
    broker = make_broker()
    assert isinstance(broker, AzureStorageQueueBroker)
    assert broker.conn_str == "UseDevelopmentStorage=true"
    assert (broker.ack_wait, broker.max_deliver) == (settings.pres_ack_wait_seconds, settings.pres_max_deliver)


def test_azure_storage_queue_needs_a_connection_string():
    with pytest.raises(ValueError, match="AZURE_STORAGE_QUEUE_CONNECTION_STRING"):
        Settings(queue_provider="azure_storage_queue", azure_storage_queue_connection_string="  ")
