import { isRelevantToday } from 'components/TodoList/utils';
import { useCallback, useMemo } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useParsedGame } from './useParsedGame';

export type Todo = {
  text: string;
  createdAtMillis?: number;
  NO_ID_FIELD?: string;
  isRelevantToday?: boolean;
};

export function useTodos() {
  const { parsedGame } = useParsedGame();
  const firestore = useFirestore();
  const todosRef = useMemo(() => {
    if (parsedGame) {
      return firestore
        .collection('todos')
        .doc(`${parsedGame.gameInfo.gameId}`)
        .collection('todos');
    }
    return null;
  }, [parsedGame]);
  const queryRef = useMemo(() => {
    if (todosRef) {
      return todosRef.orderBy('createdAtMillis', 'desc');
    }
  }, [todosRef]);
  const { status, data } = useFirestoreCollectionData<Todo>(queryRef);
  const createTodo = useCallback(
    (todo: Todo) => {
      if (todosRef !== null) {
        return todosRef.add({
          ...todo,
          createdAtMillis: Date.now(),
        });
      }
    },
    [todosRef]
  );
  const mutatedData = useMemo(
    () =>
      data === null || data === undefined
        ? []
        : data.map((todo) => ({
            ...todo,
            isRelevantToday: isRelevantToday(todo, parsedGame.gameInfo.weekday),
          })),
    [data, parsedGame]
  );
  const deleteTodo = useCallback((id: string) => {
    if (todosRef) {
      return todosRef.doc(id).delete();
    }
  }, []);
  return {
    status,
    todos: mutatedData,
    createTodo,
    deleteTodo,
  };
}
