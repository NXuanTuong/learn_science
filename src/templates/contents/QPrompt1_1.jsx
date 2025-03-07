function QPrompt1_1({ data, order, isLast }) {
  const content = data?.content || data?.prompt;
  const contentText =
    content?.texts[0] !== null &&
    content?.texts[0] !== undefined &&
    content?.texts[0]?.length > 0
      ? content?.texts[0]
      : "";

  const questionText =
    data?.question?.texts[0] !== null &&
    data?.question?.texts[0] !== undefined &&
    data?.question?.texts[0]?.length > 0
      ? data?.question?.texts[0]
      : "";

  //   const [isLoading, setIsLoading] = useState(
  //     checkImage(content?.images[0])
  //       ? getCacheImage([content?.images[0]])
  //         ? false
  //         : true
  //       : false
  //   );
  //   var key = getImageUrl(content?.images[0]);
  //   loadWidthImage(key, (err, img) => {
  //     cacheImage([key]);
  //     setIsLoading(false);
  //   });

  return (
    <>
      <div
        className={`rounded-t-xl text-[1.25rem] p-[2rem_2rem_1rem] leading-[160%] gap-8 flex flex-col justify-center items-center`}
      >
        <div
          className={` max-w-[40rem] gap-4 flex flex-col justify-center items-center`}
        >
          <div>
            {data?.template.question !== null &&
              data?.template.question &&
              data?.template.question.length > 0 && (
                <span className="h-[2.2rem] px-3 text-[1.25rem] flex justify-center font-bold text-[#fafbfc] rounded-xl bg-green-900">
                  Câu {order}
                </span>
              )}
          </div>
          {contentText}
        </div>
        {content?.images[0] && (
          <img
            className="w-full"
            alt={content?.images[0]}
            onError={(e) => {
              e.target.src = "";
              e.target.style.width = "2.5rem";
              e.target.style.height = "2.5rem";
            }}
          />
        )}

        <>{questionText}</>
      </div>
    </>
  );
}

export default QPrompt1_1;
