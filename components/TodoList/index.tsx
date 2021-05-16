import { Button, Pane, TextInput, Paragraph, TrashIcon } from 'evergreen-ui';
import { Todo, useTodos } from 'hooks/useTodos';
import { useCallback, useState } from 'react';

type Props = {};

const TodoList: React.FC<Props> = (props) => {
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
    <Pane width="100%">
      <Pane width="100%">
        <TextInput
          value={inputValue}
          placeholder="Go to Krobus on Fridays for Iridium Sprinkler"
          onChange={onChange}
          onKeyDown={onEnter}
          width="90%"
        />
        <Button
          fontSize="1.5rem"
          lineHeight="1.5rem"
          width="10%"
          textAlign="center"
          onClick={onCreateTodo}
        >
          +
        </Button>
      </Pane>
      {todos &&
        todos.map((todo: Todo, i) => (
          <Pane
            key={i}
            width="100%"
            display="flex"
            flexDirection="row"
            paddingY={5}
          >
            <Pane width="90%" display="flex">
              <Paragraph>{todo.text}</Paragraph>
            </Pane>
            <Pane>
              <TrashIcon
                cursor="pointer"
                onClick={() => {
                  deleteTodo(todo.NO_ID_FIELD);
                }}
              />
            </Pane>
          </Pane>
        ))}
    </Pane>
  );
};

export default TodoList;
