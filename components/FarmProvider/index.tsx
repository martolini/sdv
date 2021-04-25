import { useParsedGame } from 'hooks/useParsedGame';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useFirestore } from 'reactfire';
import { ParsedGame } from 'utils/parser';

const FarmProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const firestore = useFirestore();
  const { setParsedGame, setLoading } = useParsedGame();
  useEffect(() => {
    if (router.isReady) {
      if (router.query.farm) {
        // We have a farm, wooho. Let's subscribe
        setLoading(true);
        const ref = firestore
          .collection(`newfarms`)
          .doc(router.query.farm.toString())
          .onSnapshot((doc) => {
            if (doc.exists) {
              setParsedGame(doc.data() as ParsedGame);
            }
            setLoading(false);
          });
        return ref;
      } else {
        setLoading(false);
      }
    }
  }, [router.query.farm]);
  return <>{children}</>;
};

export default FarmProvider;
