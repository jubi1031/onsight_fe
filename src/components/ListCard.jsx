import style from '../css/ListCard.module.css';

const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  };
  const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(
    new Date(date)
  );
  return formattedDate.replace(/\./g, '.');
};

const ListCard = ({ title, center, detail, date, thumbnail, itemType }) => {
  const apiUrl = process.env.REACT_APP_BACK_URL;
  const imgPath =
    itemType === 'challenge' || itemType === 'center'
      ? thumbnail
      : `${apiUrl}` + thumbnail;
  const renderDate = () => {
    if (Array.isArray(date)) {
      return (
        <span>
          {formatDate(date[0])} ~ {formatDate(date[1])}
        </span>
      );
    }
    return <span>{formatDate(date)}</span>;
  };

  return (
    <a href="" className={style.card}>
      <span className={style.imgBox}>
        <img src={imgPath} alt="대표이미지" />
      </span>

      {itemType === 'center' ? (
        <>
          <strong className={style.tit}>{center}</strong>
          <span className={style.detail}>{detail}</span>
        </>
      ) : (
        <>
          <strong className={style.tit}>{title}</strong>
          <span>{center}</span>
          {renderDate()}
        </>
      )}
    </a>
  );
};

export default ListCard;
