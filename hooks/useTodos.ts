import { useCallback, useMemo } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useParsedGame } from './useParsedGame';

export type Todo = {
  text: string;
  createdAtMillis?: number;
  NO_ID_FIELD?: string;
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
  const { status, data } = useFirestoreCollectionData(queryRef);
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
  const deleteTodo = useCallback((id: string) => {
    if (todosRef) {
      return todosRef.doc(id).delete();
    }
  }, []);
  return {
    status,
    todos: data,
    createTodo,
    deleteTodo,
  };
}
