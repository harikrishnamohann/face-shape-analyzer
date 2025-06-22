#! /usr/bin/env lua

-- usage: ./generate_json_for_db.lua [stylesheet|hairstyles]
-- or just ./generate_json_for_db.lua to generate both json files

-- to run this lua script,
-- install luarocks and install the following libraries first.
local mime = require "mime" -- I didn't have to install this
local lfs = require "lfs" -- sudo luarocks install luafilesystem
local json = require "dkjson" -- sudo luarocks install dkjson

local root = "./stylesheet"
local shapes = {"oval", "round", "oblong", "triangle", "square", "diamond", "heart"}
local shape_desc = {
  oval = "You’ve got an oval shaped face, congratulations; you’ve hit the genetic jackpot of head shapes. Seriously, it’s the Swiss Army knife of face shapes, which means the world of grooming is your oyster.",
  round = "You've got a round shaped face, the key to choosing a flattering hairstyle for round face is to create the illusion of length and angles. This can be achieved by adding height on top and keeping the sides shorter and more streamlined. Avoid hairstyles that add width to the sides or create a fringe that falls across the forehead.",
  oblong = "You've got an oblong shaped face. Choose hairstyles that minimize the length and add width to the face. Avoid hairstyles that add height or make the face appear narrower. Focus on styles that create a more balanced and oval-like appearance.",
  triangle = "You've got a triangle shaped face. For men with a triangle face shape, the goal is to balance the wider jawline by adding volume and width to the forehead and crown area while minimizing volume on the sides and jawline. Popular choices include styles with volume on top like quiffs or pompadours, and longer styles with side parts.",
  square = "You've got a square shaped face. For men with square faces, the goal is often to soften the strong jawline while maintaining a masculine look. Hairstyles that add height and volume on top, with shorter, tapered sides, are generally a good choice.",
  diamond = "You've got a diamond shaped face. For men with diamond-shaped faces, the goal is to soften the angles and create more balance by adding width to the forehead and chin, while minimizing the prominence of the cheekbones. Longer hairstyles with layers, side-swept bangs, or textured tops are good options. Avoid styles that emphasize the cheekbones, like very short sides or slicked-back styles with little volume.",
  heart = "You've got a heart shaped face. For a heart-shaped face, hairstyles that add width to the jawline and soften the forehead are ideal. Men with heart-shaped faces can consider styles like textured crops with side bangs, or longer styles with loose waves and a side part to balance the wider forehead and narrower chin.",
}

-- reads file_path and return converted base64 string of file content
local function read_file_as_base64(file_path)
  local fd = io.open(file_path, "rb");
  if not fd then
    return nil
  end
  local content = fd:read("*all");
  fd:close();
  return mime.b64(content);
end

-- returns a list of non-hidden items in a directory
local function list_directory(dir)
  local contents = {}
  for entity in lfs.dir(dir) do
    if not entity:match("^%.+$") then
      table.insert(contents, entity)
    end
  end
  return contents
end

local function generate_stylesheet_json()
  local style_sheet = {}
  for i, shape_name in ipairs(shapes) do
    local shape_path = root .. "/" .. shape_name
    local hairstyles_list = {}

    for j, style_name in ipairs(list_directory(shape_path)) do
      hairstyles_list[j] = style_name
    end

    style_sheet[i] = {
      shape = shape_name,
      description = shape_desc[shape_name],
      hairstyles = hairstyles_list
    }
  end

  local style_sheet_json = json.encode(style_sheet, { indent = true })
  local file, err= io.open("stylesheet.json", "w")
  if file then
    file:write(style_sheet_json)
    file:close()
  else
    print("file opening error: " .. err)
  end
end

local function generate_hairstyles_json() 
  local inventory = root .. "/inventory"

  local hairstyles = {}
  for i, hairstyle_name in ipairs(list_directory(inventory)) do
    local hairstyle_path = inventory .. "/" .. hairstyle_name

    local images = {}
    for j, image in ipairs(list_directory(hairstyle_path)) do
      local image_path = hairstyle_path .. "/" .. image
      images[j] = read_file_as_base64(image_path)
    end

    hairstyles[i] = {
      name = hairstyle_name,
      images = images,
    }
  end

  local hairstyles_json = json.encode(hairstyles, { indent = true })
  local file, err = io.open("hairstyles.json", "w")
  if file then
    file:write(hairstyles_json)
    file:close()
  else
    print("error opening file: " .. err)
  end
end



if #arg == 1 then
  if arg[1]:match("stylesheet") then
    generate_stylesheet_json()
    print("stylesheet.json ✔")
  elseif arg[1]:match("hairstyles") then
    generate_hairstyles_json()
    print("hairstyles.json ✔")
  else
    print("invalid argument")
  end
else
  generate_stylesheet_json()
  print("stylesheet.json ✔")
  generate_hairstyles_json()
  print("hairstyles.json ✔")
end
