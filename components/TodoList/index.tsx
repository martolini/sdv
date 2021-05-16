import { Button, Pane, Paragraph, TrashIcon, Card } from 'evergreen-ui';
import { Todo, useTodos } from 'hooks/useTodos';
import { useCallback, useMemo, useRef } from 'react';
import styles from './TodoList.module.css';
import Tagify from '@yaireo/tagify/dist/react.tagify'; // React-wrapper file
import allWikiPages from 'data/allWikiPages';
import { formatTag } from './utils';

const TodoList: React.FC = () => {
  const { todos, createTodo, deleteTodo } = useTodos();

  const whitelistedWords = useMemo(() => {
    return Object.values(allWikiPages).map((p) => ({
      value: p.name,
      href: p.href,
    }));
  }, []);

  const tagifyRef = useRef<typeof Tagify>();
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (tagifyRef && tagifyRef.current) {
        const text = tagifyRef.current!.state.lastOriginalValueReported;
        if (text && text.length > 0) {
          const trimmedText = text.trim().replace(/\s+/g, ' ');
          createTodo({ text: trimmedText });
          tagifyRef.current.loadOriginalValues('');
        }
      }
    },
    [tagifyRef]
  );

  return (
    <Pane width="100%" display="flex" flexDirection="column">
      <Pane width="100%" display="flex" flexDirection="row">
        <form
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          onSubmit={onSubmit}
        >
          <Pane width="88%" display="block">
            <Tagify
              tagifyRef={tagifyRef}
              whitelist={whitelistedWords}
              duplicates={true}
              placeholder="visit the @traveling cart every friday and sunday"
              settings={{
                pattern: '@',
                mode: 'mix',
                enforceWhitelist: true,
                dropdown: {
                  enabled: 1,
                  highlightFirst: true,
                  position: 'text',
                },
              }}
            />
          </Pane>
          <Button
            height="100%"
            float="right"
            textAlign="center"
            // onClick={onCreateTodo}
            type="submit"
            className={styles.submitButton}
          >
            + Add
          </Button>
        </form>
      </Pane>
      <Pane
        display="flex"
        height="100%"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="space-between"
        marginTop={10}
      >
        {todos &&
          todos.map((todo: Todo, i) => (
            <Card
              key={i}
              width="45%"
              className={styles.card}
              minHeight={50}
              display="flex"
              alignItems="center"
              flexDirection="row"
              elevation={2}
              paddingX="3%"
              paddingY="3%"
              marginY="2%"
              hoverElevation={4}
            >
              <Paragraph
                className={styles.paragraph}
                size={500}
                dangerouslySetInnerHTML={{ __html: formatTag(todo.text) }}
              ></Paragraph>
              <div
                className={styles.delete}
                onClick={() => {
                  deleteTodo(todo.NO_ID_FIELD);
                }}
              >
                <TrashIcon />
              </div>
            </Card>
          ))}
      </Pane>
    </Pane>
  );
};

export default TodoList;
