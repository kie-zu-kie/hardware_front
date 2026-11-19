import "./../astylecomp/PageHeading.css";

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && (
          <span className="eyebrow">
            {eyebrow}
          </span>
        )}

        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}

export default PageHeading;