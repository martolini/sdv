import { Button, CloudUploadIcon, Paragraph, toaster } from 'evergreen-ui';
import React, { useCallback, useState } from 'react';
import useInterval from 'use-interval';
import platform from 'platform';
import { parseXml } from 'utils/parser';
import { useParsedGame } from 'hooks/useParsedGame';

type Props = {};

const FileUploadListener: React.FC<Props> = (props) => {
  const [fileHandle, setFileHandle] = useState<any>();
  const [saveFile, setSaveFile] = useState<any>();
  const { setParsedGame, uploadFarm } = useParsedGame();
  const [polling, setPolling] = useState(false);
  useInterval(
    async () => {
      if (fileHandle !== undefined && saveFile !== undefined) {
        const file = await fileHandle!.getFile();
        if (file.lastModified !== saveFile.lastModified) {
          const parsedGame = parseXml(await file.text());
          setParsedGame(parsedGame);
          setSaveFile(file);
          uploadFarm(parsedGame);
        } else {
          console.log(file.lastModified, saveFile.lastModified);
        }
      }
    },
    polling ? 10000 : null
  );
  const onClick = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        // @ts-ignore
        const [fileHandle] = await window.showOpenFilePicker({
          multiple: false,
          types: [
            {
              description: 'Stardew savegame',
            },
          ],
        });
        const file = await fileHandle.getFile();
        const contents = await file.text();
        const parsedGame = parseXml(contents as string);
        setParsedGame(parsedGame);
        setFileHandle(fileHandle);
        setSaveFile(file);
        uploadFarm(parsedGame);
        setPolling(true);
      } catch (ex) {
        toaster.danger(ex.message);
      }
    },
    [platform.os.family]
  );
  return (
    <Button onClick={onClick}>
      <Paragraph fontSize="0.9rem" fontFamily="mono" letterSpacing={0.6}>
        Upload file
      </Paragraph>
      <CloudUploadIcon
        paddingLeft={5}
        size={20}
        color="info"
        alignSelf="center"
      />
    </Button>
  );
};

export default FileUploadListener;
