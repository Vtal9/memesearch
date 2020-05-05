import torch
from craft import CRAFT
import imgproc
from torch.autograd import Variable
from recognition import copyStateDict

image = imgproc.loadImage('sample/22.jpg')
img_resized, target_ratio, size_heatmap = imgproc.resize_aspect_ratio(image, square_size=1280,
                                                                      interpolation=1, mag_ratio=1.5)
x = imgproc.normalizeMeanVariance(img_resized)
x = torch.from_numpy(x).permute(2, 0, 1)  # [h, w, c] to [c, h, w]
x = Variable(x.unsqueeze(0))  # [c, h, w] to [b, c, h, w]
net = CRAFT()
net.load_state_dict(copyStateDict(torch.load("craft_mlt_25k.pth", map_location='cpu')))
net.eval()
script = torch.jit.trace(net, x)
script.save('craft_model.zip')
