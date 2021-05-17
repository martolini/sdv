import {
  Button,
  Pane,
  Paragraph,
  TrashIcon,
  Card,
  useTheme,
} from 'evergreen-ui';
import { Todo, useTodos, TodoType } from 'hooks/useTodos';
import { useCallback, useMemo, useRef } from 'react';
import styles from './TodoList.module.css';
import Tagify from '@yaireo/tagify/dist/react.tagify'; // React-wrapper file
import allWikiPages from 'data/allWikiPages';
import { formatTag } from './utils';
import { useParsedGame } from 'hooks/useParsedGame';

const wikifyString = (text: string) => {
  if (!text) return text;
  return `<a href="https://stardewvalleywiki.com/${text
    .split(' ')
    .join('_')}" target="_blank">${text}</a>`;
};

const TodoList: React.FC = () => {
  const { todos, createTodo, deleteTodo } = useTodos();
  const theme = useTheme() as any;

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
          createTodo({ text: trimmedText, type: TodoType.CUSTOM });
          tagifyRef.current.loadOriginalValues('');
        }
      }
    },
    [tagifyRef]
  );

  const { parsedGame } = useParsedGame();
  const suggestedTodos = useMemo(() => {
    // Create birthday todo
    const todos = [];
    if (parsedGame) {
      const birthday = parsedGame.todaysBirthday;
      if (birthday) {
        const todo = {
          text: `${wikifyString(
            birthday.name
          )} has their birthday today, remember to give a lovely gift!`,
          isRelevantToday: true,
          type: TodoType.BIRTHDAY,
        } as Partial<Todo>;
        todos.push(todo);
      }
      // Find missing items
      const { bundleInfo } = parsedGame;
      for (const bundle of bundleInfo) {
        const { missingIngredients } = bundle;
        const deliverableItems = missingIngredients.filter(
          (item) => item.deliverableInBundle
        );
        if (deliverableItems.length === 0) continue;
        const ingredientsText = deliverableItems
          .map((item) => {
            return `${wikifyString(item.name)} x ${item.stack}`;
          })
          .join(', ');
        let text = `You can deliver ${ingredientsText} for the ${wikifyString(
          `${bundle.bundleName} Bundle`
        )}`;
        let color = theme.colors.purpleTint;
        if (deliverableItems.length === bundle.nMissing) {
          text = `${text} to finish it!`;
          color = theme.colors.tealTint;
        }
        todos.push({
          text,
          color,
          type: TodoType.BUNDLE,
        });
      }
    }
    return todos;
  }, [parsedGame]);
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
          [...todos, ...suggestedTodos].map((todo: Todo, i) => (
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
              backgroundColor={
                todo.isRelevantToday ? theme.colors.yellowTint : todo.color
              }
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
