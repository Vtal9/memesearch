import craft_utils
from cv2 import INTER_LINEAR
import imgproc
import numpy as np
import pytesseract
import torch

from craft import CRAFT
from collections import OrderedDict
from file_utils import list_images
from torch.autograd import Variable

# Most part of this code borrowed from https://github.com/clovaai/CRAFT-pytorch

def copyStateDict(state_dict):
    if list(state_dict.keys())[0].startswith("module"):
        start_idx = 1
    else:
        start_idx = 0
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = ".".join(k.split(".")[start_idx:])
        new_state_dict[name] = v
    return new_state_dict


def netForward(net, image, text_threshold=0.7, link_threshold=0.4, low_text=0.4):
    # Resize
    img_resized, target_ratio, size_heatmap = imgproc.resize_aspect_ratio(image, square_size=1280, interpolation=INTER_LINEAR, mag_ratio=1.5)
    ratio_h = ratio_w = 1 / target_ratio

    # Preprocessing
    x = imgproc.normalizeMeanVariance(img_resized)
    x = torch.from_numpy(x).permute(2, 0, 1)    # [h, w, c] to [c, h, w]
    x = Variable(x.unsqueeze(0))                # [c, h, w] to [b, c, h, w]

    # Forward pass
    with torch.no_grad():
        y, feature = net(x)

    # Make score and link map
    score_text = y[0,:,:,0].cpu().data.numpy()
    score_link = y[0,:,:,1].cpu().data.numpy()

    # Post-processing
    boxes, polys = craft_utils.getDetBoxes(score_text, score_link, text_threshold, link_threshold, low_text)

    # coordinate adjustment
    boxes = craft_utils.adjustResultCoordinates(boxes, ratio_w, ratio_h)
    polys = craft_utils.adjustResultCoordinates(polys, ratio_w, ratio_h)
    for k in range(len(polys)):
        if polys[k] is None: polys[k] = boxes[k]

    # render results (optional)
    render_img = score_text.copy()
    render_img = np.hstack((render_img, score_link))
    ret_score_text = imgproc.cvt2HeatmapImg(render_img)

    return boxes, polys, ret_score_text


def recognizeText(image, bboxes):
    config = ("-l rus --oem 1 --psm 13")
    text = []
    for box in bboxes:
        roi = image[box[0,1]:box[2,1], box[0,0]:box[2,0]]
        #cv2.imshow("ROI", roi)
        #cv2.waitKey(0)
        word = pytesseract.image_to_string(roi, config=config)
        text.append(word)
    return text


def convertImagesToTexts(folder='media/'):
    '''
    Recognizes text from every image in given folder
    Parameters:
     - folder - path to folder with images
    Return value:
     - list of tuples of 3 strings: (image_path, text_on_image, "") 
    '''
    # Loading the net
    net = CRAFT()
    net.load_state_dict(copyStateDict(torch.load("craft_mlt_25k.pth", map_location='cpu')))
    net.eval()

    # Get list of images
    image_list = list_images(folder)
    result = []
    for img_path in image_list:
        image = imgproc.loadImage(img_path)
        bboxes, polys, score_text = netForward(net, image)
        polys = craft_utils.postProcess(polys, image.shape)
        texts = recognizeText(image[:,:,::-1], polys)
        result.append((img_path, " ".join(texts), ""))
    return result


if __name__ == '__main__':
        print("Path to folder with images: ")
        folder = input()
        print(convertImagesToTexts(folder=folder))