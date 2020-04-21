import cv2
import sys
import numpy as np
from datetime import datetime

import craft_utils
from file_utils import list_images
from recognition import recognizeText


def test_accuracy(folder_path):
    image_list = list_images(folder_path)
    textBoxes = cv2.text.TextDetectorCNN_create(
        "textboxes.prototxt", "TextBoxes_icdar13.caffemodel"
    )
    for img_path in image_list:
        image = cv2.imread(img_path)
        # cv2.resize(image, (300, 300))
        bboxes, confidences = textBoxes.detect(image)
        for bbox, score in zip(bboxes, confidences):
            copy = image.copy()
            x, y, w, h = tuple(bbox)
            cv2.rectangle(copy, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(copy, str(score[0]), (x, y - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
            cv2.imshow("str score", copy)
            cv2.waitKey(0)


if __name__ == "__main__":
    test_accuracy(sys.argv[1])
    # print(cv2.__version__)
