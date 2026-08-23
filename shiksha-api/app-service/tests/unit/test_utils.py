from app.utils.utils import local_unique_id


def test_local_unique_id_is_unique_for_65k_generations():
    assert len({local_unique_id(i) for i in range(1 << 16)}) == 1 << 16
