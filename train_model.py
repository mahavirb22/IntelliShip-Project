import pandas as pd
from pathlib import Path
import json
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.tree import export_text
from sklearn.preprocessing import LabelEncoder

# Load dataset
data = pd.read_csv("dataset.csv")

# Features and labels
X = data[["pulseCount", "maxHigh", "totalHigh", "risingEdges", "avgHigh"]]
raw_labels = data["label"]

label_encoder = LabelEncoder()
y = label_encoder.fit_transform(raw_labels)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = DecisionTreeClassifier(max_depth=4)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

# Print learned rules
print("\nLearned Decision Rules:\n")
rules = export_text(model, feature_names=list(X.columns))
print(rules)

# Persist model artifacts for serving
artifacts_dir = Path("ml-service/model_artifacts")
artifacts_dir.mkdir(parents=True, exist_ok=True)

joblib.dump(model, artifacts_dir / "decision_tree_model.joblib")

with open(artifacts_dir / "label_mapping.json", "w", encoding="utf-8") as f:
	json.dump(
		{
			"classes": label_encoder.classes_.tolist(),
			"feature_order": ["pulseCount", "maxHigh", "totalHigh", "risingEdges", "avgHigh"],
		},
		f,
		indent=2,
	)

print(f"\nSaved artifacts to: {artifacts_dir.resolve()}")