import {
  Pane,
  TextInput,
  Paragraph,
  TrashIcon,
  Card,
  IconButton,
  PlusIcon,
} from 'evergreen-ui';
import { Todo, useTodos } from 'hooks/useTodos';
import { useCallback, useState } from 'react';
import styles from './TodoList.module.css';

const TodoList: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const onChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
    },
    [setInputValue]
  );

  const { todos, createTodo, deleteTodo } = useTodos();
  const onCreateTodo = useCallback(() => {
    if (inputValue.length === 0) return;
    const text = inputValue.trim();
    createTodo({ text });
    setInputValue('');
  }, [inputValue, todos]);

  const onEnter = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        onCreateTodo();
      }
    },
    [onCreateTodo]
  );

  return (
    <Pane display="flex" flexDirection="column" marginTop={25}>
      <Pane display="flex" flexDirection="row">
        <TextInput
          value={inputValue}
          placeholder="Go to Krobus on Fridays for Iridium Sprinkler"
          onChange={onChange}
          onKeyDown={onEnter}
          flex="1"
        />
        <IconButton icon={PlusIcon} />
      </Pane>
      <Pane
        display="flex"
        height="100%"
        flexWrap="wrap"
        justifyContent="center"
        marginTop={10}
      >
        {todos &&
          todos.map((todo: Todo, i) => (
            <Card
              key={i}
              width="40%"
              className={styles.card}
              minHeight={50}
              display="flex"
              alignItems="center"
              flexDirection="row"
              paddingY={10}
              paddingX={16}
              marginX={16}
              marginY={12}
              elevation={3}
              hoverElevation={4}
            >
              <Paragraph>{todo.text}</Paragraph>
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
