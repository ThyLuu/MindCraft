"use client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig"; // 🔥 Nhớ import db nếu chưa có!
import { Loader2Icon } from "lucide-react";

export function Room({ children, params }) {
  const parsedParams = (() => {
    try {
      return params?.value ? JSON.parse(params.value) : params;
    } catch (e) {
      console.error("Lỗi parse:", e);
      return { documentid: null };
    }
  })();

  const roomId = parsedParams?.documentid || parsedParams?.workspaceid || 'default-room';

  if (!roomId) {
    return <div className="text-red-500 text-center mt-10">Invalid room ID</div>;
  }

  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth?roomId=" + roomId}

      resolveUsers={async ({ userIds }) => {
        // console.log("User IDs:", userIds);

        // if (!userIds || userIds.length === 0) {
        //   console.log("Không có userIds để truy vấn.");
        //   return [];
        // }

        const userList = [];

        // 🔥 Chia nhỏ userIds nếu vượt quá 10 phần tử (Firestore giới hạn)
        const chunkSize = 10;

        for (let i = 0; i < userIds.length; i += chunkSize) {
          const chunk = userIds.slice(i, i + chunkSize); // Cắt mảng thành từng phần nhỏ

          const q = query(collection(db, "MindCraftUsers"), where("email", "in", chunk));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            // console.log("User Data:", doc.data());
            userList.push(doc.data());
          });
        }

        // console.log("Final userList:", userList);
        return userList;
      }}

      resolveMentionSuggestions={async ({ text, roomId }) => {
        const q = query(collection(db, 'MindCraftUsers'), where('email', '!=', null));
        const querySnapshot = await getDocs(q);
        let userList = [];
        querySnapshot.forEach((doc) => {
          userList.push(doc.data())
        })

        console.log(userList)

        if (text) {
          userList = userList.filter((user) => user.name.includes(text));
        }
        console.log(userList.map((user) => user.email))

        return userList.map((user) => user.email);
      }}
    >
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={
          <div className="flex flex-col items-center justify-center h-screen">
            <Loader2Icon className="animate-spin mb-2" />
            <span>Loading…</span>
          </div>
        }>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
