from behave import then

from app.repositories.paragraph_repository import ParagraphRepository


@then('系統中不應有段落 "{title}"')
def step_then_paragraph_absent(context, title):
    context.db_session.expire_all()
    found = ParagraphRepository(context.db_session).find_by_title(title)
    assert not found, f"系統中仍有段落 '{title}'（id={[p.id for p in found]}）"
