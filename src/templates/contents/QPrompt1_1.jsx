import ImageFromUrl from "../../helper/imageFromUrl";

function QPrompt1_1({ data, order, isLast }) {
  const content = data?.content || data?.prompt;
  const texts = content?.texts || [];
  const images = content?.images || [];

  // Gộp texts và images xen kẽ nếu không có content.items
  const items = [];
  const maxLength = Math.max(texts.length, images.length);
  for (let i = 0; i < maxLength; i++) {
    if (texts[i]) items.push({ type: "text", value: texts[i] });
    if (images[i]) items.push({ type: "image", value: images[i] });
  }

  return (
    <div
      className={`rounded-t-xl text-[1.25rem] p-[2rem_2rem_1rem] leading-[160%] gap-8 flex flex-col justify-center items-center`}
    >
      <div
        className={`max-w-[40rem] gap-4 flex flex-col justify-center items-center select-none`}
      >
        {data?.template?.question?.length > 0 && (
          <span className="h-[2.2rem] px-3 text-[1.25rem] flex justify-center font-bold text-[#fafbfc] rounded-xl bg-green-900">
            Câu {order}
          </span>
        )}

        {/* Render xen kẽ text và image */}
        {items.map((item, index) =>
          item.type === "text" ? (
            <p key={index} className="text-lg text-gray-800 text-center">
              {item.value}
            </p>
          ) : (
            <ImageFromUrl
              key={index}
              objectId={item.value}
              className="object-contain mx-auto"
            />
          )
        )}
      </div>
    </div>
  );
}

export default QPrompt1_1;
