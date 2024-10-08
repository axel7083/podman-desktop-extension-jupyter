/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { createServer } from 'node:net';

export async function getFreeRandomPort(address: string = '0.0.0.0'): Promise<number> {
  const server = createServer();
  return new Promise((resolve, reject) =>
    server
      .on('error', (error: NodeJS.ErrnoException) => reject(error))
      .on('listening', () => {
        const addr = server.address();
        if (typeof addr === 'string') {
          // this should not happen, as it is only for pipes and unix domain sockets
          server.close(() => reject(new Error('error getting allocated port')));
        } else if (addr) {
          // not sure what the call to close will do on the addr value
          // => the port value is saved before to call close
          const allocatedPort = addr.port;
          server.close(() => resolve(allocatedPort));
        } else {
          reject(new Error('invalid server address'));
        }
      })
      .listen(0, address),
  );
}
